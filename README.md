# FiScroll
## Thanks
Plugin was rewritten from [bazinas](https://github.com/buzinas)'s [simple-scrollbar](https://github.com/buzinas/simple-scrollbar)
Example was taken from [asafdav](https://github.com/asafdav)'s [ng-scrollbar](https://github.com/asafdav/ng-scrollbar)
## Use
```html
    <div class="scrollme" 
         ng-fiscroll
         hide-scroll-on-out="true"
         hide-timeout="3000"
         is-bar-shown="barShown"
         rebuild-on="$rebuild-scroll">
```
```css
    .scrollme {
        max-height: 200px; // Max height of block :)
    }
```
## Functionality
```javscript
   {
        'isBarShown': '=', // Model shows bar is shown
        'hideScrollOnOut': '=', // Hide on mouse out / touchend
        'hideTimeout': '=', // Hide after ms 
        'rebuildOn': '@', // Recalculate scroll on handling this event
    }`
