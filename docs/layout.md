# Code Layout
## Statement Frequency
Typically, there should be only one statement/operation per line. A statement with multiple high-level components may be broken into multiples.  
[Back to TOC](toc.md)
## Indentation
4 spaces per indent is recommended, though 2 spaces may be preferrable for some html templates.  
[Back to TOC](toc.md)
## Error Handling
Throw error objects to alert the application that a subroutine is working with bad or unexpected data. Synchronous subroutines may contain try/catch blocks if specific handling is meant to occur when an error arises. Asynchronous subroutines use the **then** and **catch** promises for performing follow-up subroutines.  
[Back to TOC](toc.md)
