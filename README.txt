Although I am delivering this before the limit time, there would still be a few things I would have done different if i had more time 
and if the code were to be expanded upon. 
I refer mostly to the navigation system and to the language change mechanic. 
The navigation is a bit hardcoded, each new page would require their own function and their own call event listener; 
Given more time ideally this would have been done by a centralized routing class that would render the pages dynamically with a single render 
method. The keyboard navigation is also iffy, I used a myriad of if clauses to identify where the user was navigating and to then give the proper 
response. With more time I would do this differently, by creating some sort of grid, and place all selectable elements  by row and column, new elements 
would add to the grid and hidden elements would retract from it. From there the navigation would be done dynamically and always the same without having 
to adapt it if the number of elements were added or retracted (e.g. side menus, Advertisement boxes, pop ups). But again for the project time and size 
given, I deemed this course of action overkill and to be honest impractical.

The language change is based on a javascript external local file with a globally available object that the classes access according a language parameter 
and from there they fetch the translations and inject them on each of the elements required. It works, but to work each and every single one of the 
language entries need to be filled and if we were to add more elements we would have to both add the key to the file and hardcode the injection on the 
render method. The way I have done this before is to have a template engine that would replace target variables in the HTML according to the language, 
or have call back to a server side translations file that renders the content according to the language of the file selected. Either way I am not really 
sure how to do this in a more efficient way without using server code or using a more complex framework/library. 
And that takes me to my last point. This exercise was quite a fun challenge; And I had never built a MVC style app using only client side code. 
Thank you for considering me.
David Camacho
