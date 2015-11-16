# controlled-merge

controlled-merge is a utility function to merge a number of javascript objects into a singular object. It has an optional onConflict functionality that allows you to specify how to handle conflicts of the merge.

__merge([onConflict], [objects]);__

* onConflict(objectOne, objectTwo, attr)
  * Optional function to define what happens when non objects are detected and conflict. By default, it will assign the later merge object over the earlier one. The name of the conflicting attribute will be present as the third parameter.
* objects
  * Either a singular array of all objects passed in, or manually passed in arguments.

##Install

```
npm install controlled-merge
```

## Example

```
var merge = require('controlled-merge');

//Input
var x =
  {
    'test': 'This is a test string'
  };
var y =
  {
    'also': 'is a test',
    'value': 1
  };
var z =
  {
    'value': 3
  };
var conflictingKeys = [];
  
var results = merge(
  function(obj1, obj2, attr){
    conflictingKeys.push(attr);
    return obj1 > obj2 ? obj1 : obj2;
  },
  x, y, z
);

//results =
{
  'test': 'This is a test string',
  'also': 'is a test',
  'value': 3
}

//conflictingKeys = 
[
  'value'
]

```

## Why?
I needed to combine JSONs that represented role-based permissions for [CanThey](https://github.com/hlfshell/CanThey) - the idea being that a user can have several roles and I needed to calculate resulting permissions.
