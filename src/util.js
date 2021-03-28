var colorToRGBA;
{
    let memoize = function(factory, ctx) {
        var cache = {};
        return function(key) {
            if (!(key in cache)) {
                cache[key] = factory.call(ctx, key);
            }
            return cache[key];
        };
    };
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d');
    
    colorToRGBA = (function() {
        return memoize(function(col) {
            ctx.clearRect(0, 0, 1, 1);
            // In order to detect invalid values,
            // we can't rely on col being in the same format as what fillStyle is computed as,
            // but we can ask it to implicitly compute a normalized value twice and compare.
            ctx.fillStyle = '#000';
            ctx.fillStyle = col;
            var computed = ctx.fillStyle;
            ctx.fillStyle = '#fff';
            ctx.fillStyle = col;
            if (computed !== ctx.fillStyle) {
                return; // invalid color
            }
            ctx.fillRect(0, 0, 1, 1);
            return [ ... ctx.getImageData(0, 0, 1, 1).data ];
        });
    })();
}
export var colorToRGBA;