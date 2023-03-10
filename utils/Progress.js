/**
 * @file node-progress
 * @copyright 2011 TJ Holowaychuk <tj@vision-media.ca>
 * @license GPL-3.0
 */

/**
 * Expose `ProgressBar`.
 */

exports = module.exports = ProgressBar;

/**
 * Initialize a `ProgressBar` with the given `fmt` string and `options` or
 * `total`.
 *
 * Options:
 *
 *   - `curr` current completed index
 *   - `total` total number of ticks to complete
 *   - `width` the displayed width of the progress bar defaulting to total
 *   - `stream` the output stream defaulting to stderr
 *   - `head` head character defaulting to complete character
 *   - `complete` completion character defaulting to "="
 *   - `incomplete` incomplete character defaulting to "-"
 *   - `renderThrottle` minimum time between updates in milliseconds defaulting to 16
 *   - `callback` optional function to call when the progress bar completes
 *   - `clear` will clear the progress bar upon termination
 *
 * Tokens:
 *
 *   - `:bar` the progress bar itself
 *   - `:current` current tick number
 *   - `:total` total ticks
 *   - `:elapsed` time elapsed in seconds
 *   - `:percent` completion percentage
 *   - `:eta` eta in seconds
 *   - `:rate` rate of ticks per second
 *
 * @function ProgressBar
 * @param {string} fmt the string with the formatting tokens
 * @param {object|number} options the options for the progress bar
 * @returns {void}
 * @api public
 */
function ProgressBar(fmt, options) {
  this.stream = options.stream || process.stderr;

  if (typeof options === "number") {
    let total = options;
    options = {};
    options.total = total;
  } else {
    options = options || {};
    if (typeof fmt !== "string") {
      throw new Error("format required");
    }
    if (typeof options.total !== "number") {
      throw new Error("total required");
    }
  }

  this.fmt = fmt;
  this.curr = options.curr || 0;
  this.total = options.total;
  this.width = options.width || this.total;
  this.clear = options.clear;
  this.chars = {
    complete: options.complete || "=",
    incomplete: options.incomplete || "-",
    head: options.head || options.complete || "=",
  };
  this.renderThrottle =
    options.renderThrottle !== 0 ? options.renderThrottle || 16 : 0;
  this.callback = options.callback || function () {};
  this.tokens = {};
  this.lastDraw = "";
}

/**
 * "tick" the progress bar with optional `len` and optional `tokens`.
 *
 * @param {number|object} len or tokens
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.tick = function (len, tokens) {
  if (len !== 0) {
    len = len || 1;
  }

  // swap tokens
  if (typeof len === "object") {
    (tokens = len), (len = 1);
  }
  if (tokens) {
    this.tokens = tokens;
  }

  // start time for eta
  if (this.curr === 0) {
    this.start = new Date();
  }

  this.curr += len;

  // schedule render
  if (!this.renderThrottleTimeout) {
    this.renderThrottleTimeout = setTimeout(
      this.render.bind(this),
      this.renderThrottle
    );
  }

  // progress complete
  if (this.curr >= this.total) {
    if (this.renderThrottleTimeout) {
      this.render();
    }
    this.complete = true;
    this.terminate();
    this.callback(this);
  }
};

/**
 * Method to render the progress bar with optional `tokens` to place in the
 * progress bar's `fmt` field.
 *
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.render = function (tokens) {
  clearTimeout(this.renderThrottleTimeout);
  this.renderThrottleTimeout = null;

  if (tokens) {
    this.tokens = tokens;
  }

  if (!this.stream.isTTY) {
    return;
  }

  let ratio = this.curr / this.total;
  ratio = Math.min(Math.max(ratio, 0), 1);

  let percent = ratio * 100;
  let incomplete, complete, completeLength;
  let elapsed = new Date() - this.start;
  let eta = percent === 100 ? 0 : elapsed * (this.total / this.curr - 1);
  let rate = this.curr / (elapsed / 1000);

  /* populate the bar template with percentages and timestamps */
  let str = this.fmt
    .replace(":current", this.curr)
    .replace(":total", this.total)
    .replace(":elapsed", isNaN(elapsed) ? "0.0" : (elapsed / 1000).toFixed(1))
    .replace(
      ":eta",
      isNaN(eta) || !isFinite(eta) ? "0.0" : (eta / 1000).toFixed(1)
    )
    .replace(":percent", `${percent.toFixed(0)}%`)
    .replace(":rate", Math.round(rate));

  /* compute the available space (non-zero) for the bar */
  let availableSpace = Math.max(
    0,
    this.stream.columns - str.replace(":bar", "").length
  );
  if (availableSpace && process.platform === "win32") {
    availableSpace = availableSpace - 1;
  }

  let width = Math.min(this.width, availableSpace);

  /* TODO: the following assumes the user has one ':bar' token */
  completeLength = Math.round(width * ratio);
  complete = Array(Math.max(0, completeLength + 1)).join(this.chars.complete);
  incomplete = Array(Math.max(0, width - completeLength + 1)).join(
    this.chars.incomplete
  );

  /* add head to the complete string */
  if (completeLength > 0) {
    complete = complete.slice(0, -1) + this.chars.head;
  }

  /* fill in the actual progress bar */
  str = str.replace(":bar", complete + incomplete);

  /* replace the extra tokens */
  if (this.tokens) {
    for (let key in this.tokens) {
      str = str.replace(`:${key}`, this.tokens[key]);
    }
  }

  if (this.lastDraw !== str) {
    // this.stream.cursorTo(0);
    // this.stream.write(str);
    // this.stream.clearLine(1);
    this.lastDraw = str;
  }
};

/**
 * "update" the progress bar to represent an exact percentage.
 * The ratio (between 0 and 1) specified will be multiplied by `total` and
 * floored, representing the closest available "tick." For example, if a
 * progress bar has a length of 3 and `update(0.5)` is called, the progress
 * will be set to 1.
 *
 * A ratio of 0.5 will attempt to set the progress to halfway.
 *
 * @param {number} ratio The ratio (between 0 and 1 inclusive) to set the
 *   overall completion to.
 * @api public
 */

ProgressBar.prototype.update = function (ratio, tokens) {
  let goal = Math.floor(ratio * this.total);
  let delta = goal - this.curr;

  this.tick(delta, tokens);
};

/**
 * "interrupt" the progress bar and write a message above it.
 * @param {string} message The message to write.
 * @api public
 */

ProgressBar.prototype.interrupt = function (message) {
  // clear the current line
  this.stream.clearLine();
  // move the cursor to the start of the line
  this.stream.cursorTo(0);
  // write the message text
  this.stream.write(message);
  // terminate the line after writing the message
  this.stream.write("\n");
  // re-display the progress bar with its lastDraw
  this.stream.write(this.lastDraw);
};

/**
 * Terminates a progress bar.
 *
 * @api public
 */

ProgressBar.prototype.terminate = function () {
  if (this.clear) {
    if (this.stream.clearLine) {
      this.stream.clearLine();
      this.stream.cursorTo(0);
    }
  } else {
    // this.stream.write('\n');
  }
};
