# Subroutines
## Scope
Repetivie sections of code should be made subroutines to avoid parallel maintenance. Section of code that are nearly similar, except for some identifiers, should be made subroutines with parameters.  
[Back to TOC](toc.md)
## Declarations
Subroutines that are to be used externally to its containing module will use the **export** keyword. Subroutines that aren't used outside the scope of its containing module will not use the **export** keyword and will be defined as **const**. See the [example](#example) at the bottom.  
[Back to TOC](toc.md)
## Layout
Subroutines will be defined with the following standard:
- JSDoc
- First line: Keywords, Identifier, Parameters, Opening Bracket
- Code
- Last line: Closing Bracket
See the [example](#example) at the bottom.  
[Back to TOC](toc.md)
## Size
Subroutinues should be long enough to accomplish an independent, cohesive function.  
[Back to TOC](toc.md)
## Parameter List
Subroutines with more than one parameter will list the parameters on their own line, with a preceding indentation.  
[Back to TOC](toc.md)
## Variable Declaration
Declare a variable with the  **const** keyword when its value is not expected to be updated. In other instances, variables will be declard with the **var** keyword.  
[Back to TOC](toc.md)
## Example
```js
/**
 * This subroutine can be imported to other modules and templates
 * @param {string} output The parameter
*/
export function writeToConsole(output){
    console.log(output)
}

/**
 * This subroutine has multiple parameters
 * @param {string} output1 The first parameter
 * @param {string} output2 The first parameter
*/
export function writeToConsole2(
    output1,
    output2){
    console.log(output1)
    console.log(output2)
}

/**
 * This subroutine cannot be imported to other modules or templates
 * @param {string} output The parameter
*/
const writeToConsole3 = (output) => {
    console.log(output)
}
```
[Back to TOC](toc.md)