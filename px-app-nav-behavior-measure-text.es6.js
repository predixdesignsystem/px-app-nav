(function() {
  'use strict';

  /* Ensures the behavior namespace is created */
  window.PxAppNavBehavior = (window.PxAppNavBehavior || {});

  /**
   * Helps with measuring the expected length of strings of text without first
   * painting them to the DOM. Useful to do calculations on the expected size
   * of some text before painting the result of the calculation, saving
   * a paint (e.g. to determine if something will fit into a space before
   * trying to put it there).
   *
   * @polymerBehavior PxAppNavBehavior.MeasureText
   */
  PxAppNavBehavior.MeasureText = {
    /**
     * Given a string of `text` and valid CSS `fontName` and `fontSize`, measures
     * the text string using the HTML canvas API. Returns the expected width of
     * the string in pixels as a number.
     *
     * For example, to measure a bit of text using GE Inspira Sans:
     *
     *     var text = 'This is a bit of text to measure'
     *     this._measureText(text, 'GE Inspira Sans', '15px');
     *     // ... output is a size as an integer (e.g. `68` for '68px')
     *
     * @param  {String} text       A bit of text to measure
     * @param  {String} fontName   A valid [CSS font-family list](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
     * @param  {String} fontSize   A valid [CSS font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size?v=control)
     * @return {Number|undefined}  The expected width of the text in pixels as a number (e.g. `68` for '68px'), undefined it can't be measured
     */
    _measureText: function(text, fontName, fontSize) {
      var cv = this._get2dMeasureCanvas(fontName, fontSize);
      var size = cv.measureText(text).width;
      return isNaN(size) ? undefined : Math.round(size);
    },

    /**
     * Fetches a [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
     * interface configured with the given `fontName` and `fontSize`. Caches the
     * interface so it can retrieved later without rebuilding it.
     *
     * @param  {String} fontName   A valid [CSS font-family list](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family)
     * @param  {String} fontSize   A valid [CSS font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size?v=control)
     * @return {CanvasRenderingContext2D}
     */
    _get2dMeasureCanvas: function(fontName, fontSize) {
      var ctx = this.__measureContextCache;
      if (!ctx) {
        var cv = document.createElement('canvas');
        cv.height = 999;
        cv.width = 999;
        ctx = this.__measureContextCache = cv.getContext('2d');
      }

      var fontInfo = fontSize + ' ' + fontName;
      if (ctx.fontInfo !== fontInfo) {
        ctx.font = fontInfo;
      }

      return ctx;
    }
  };
})();
