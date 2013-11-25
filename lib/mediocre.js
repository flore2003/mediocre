/*!

    mediocre

    Copyright (c) 2013 Florian Reifschneider <flore2003@googlemail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

*/

var m = (function($) {
    var mediocre = {

    };

    mediocre.render = function(template, data) {
        if(data instanceof mediocre.Scope)
            var $s = data;
        else
            var $s = new mediocre.Scope(data);

        var attrs = template[0].attributes;
        for(var i = 0; i < attrs.length; i++) {
            var name = attrs.item(i).nodeName;
            if(name.substring(0, 10) === "data-attr-") {
                console.log(name);
                var name = name.substring(10);
                template.attr(name, mediocre.path($s, attrs[i].value));
            }
        }

        if(template.attr("data-loop") !== undefined) {
            var loopParams = template.attr("data-loop").split(" in ");
            if(loopParams.length == 2) {
                var valueName = loopParams[0];
                var iterableName = loopParams[1];
                var iterable = data[iterableName];
                if(iterable !== undefined) {
                    var subTemplate = template.html();
                    template.html('');
                    for(var key in iterable) {
                        var $sub = new mediocre.Scope($s);
                        $sub[valueName] = iterable[key];
                        var tpl = $(subTemplate);
                        mediocre.render(tpl, $sub);
                        template.append(tpl);
                    }
                }
            }
        }
        else if(template.attr("data-placeholder") !== undefined) {
            var placeholder = template.attr('data-placeholder');
            template.html(mediocre.path($s, placeholder));
        }
        else {
            template.children().each(function() {
                var template = $(this);
                mediocre.render(template, $s);
            });
        }
    };

    mediocre.path = function(scope, path) {
        var path = path.split(".");
        var o = scope;
        var key;
        while(key = path.shift()) {
            o = o[key];
        }
        return o;
    };

    mediocre.Scope = function(parent) {
        if(parent !== undefined) {
            var Scope = function() {};
            Scope.prototype = parent;
            Scope.constructor = this.constructor;
            return new Scope();
        }
    };

    return mediocre;
})(jQuery);

window.mediocre = m;