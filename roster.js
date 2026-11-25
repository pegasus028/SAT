/* ===========================================================================
   SAT Studio — roster.js  (the class list behind the "Class list" sign-in tab)

   FOR T.CHRIS: paste the M.6 class list into ROSTER below, one row per student:
       { id: '51234', name: 'Ploy' },
   id   = her student number (letters and numbers only, no spaces)
   name = the nickname she will look for in the list
   A student picks her nickname and sets a password the first time; after that
   she signs in with that password. While ROSTER is empty, the "Class list" tab
   is hidden and students use "Log in" / "Create account" instead.
   Nothing here is secret: nicknames and student numbers only.
   Then bump ?v= on roster.js in index.html so phones load the new list.
   =========================================================================== */
var ROSTER_CLASS = 'M.6';
var ROSTER = [
  /* { id: '51234', name: 'Ploy' }, */
];
