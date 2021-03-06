"use strict";
/**
 * Copyright (C) 2014 Scott A. Colcord <sacolcor@git.code.sf.net>

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program in the file 'LICENSE'.
 */

function isValid(variable) {
    return ((variable !== null) &&
            (variable !== undefined) &&
            (variable === variable)); // This is a way to test for NaN that
			// isn't subject to the unexpected behavior of isNaN().
}


function bake_cookie(name, value) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + 30);
    var cookie = [name, '=', JSON.stringify(value),'; expires=.', exdate.toUTCString(), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
}
function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (result) { result = JSON.parse(result[1]); }

    return result;
}


/**
 * Convert a number to a string with digits separated using an ISO delimiter.
 * @param {number} input - The number to process.
 * @returns {string} The number, with digit groups separated.
 */
function num2fmtString(input){
    var output = '';
    var i;
    output = input.toString();
    var characteristic = '', //the bit that comes before the decimal point
        mantissa = '', //the bit that comes afterwards
        digitCount = 0,
        delimiter = "&#8239;"; //thin space is the ISO standard thousands delimiter. we need a non-breaking version

    //first split the string on the decimal point, and assign to the characteristic and mantissa
    var parts = output.split('.');
    if (typeof parts[1] === 'string') { mantissa = '.' + parts[1]; } //check it's defined first, and tack a decimal point to the start of it

    //then insert the commas in the characteristic
    var charArray = parts[0].split(""); //breaks it into an array
    for (i=charArray.length; i>0; i--){ //counting backwards through the array
        characteristic = charArray[i-1] + characteristic; //add the array item at the front of the string
        digitCount++;
        if (digitCount == 3 && i!=1){ //once every three digits (but not at the head of the number)
            characteristic = delimiter + characteristic; //add the delimiter at the front of the string
            digitCount = 0;
        }
    }
    output = characteristic + mantissa; //reassemble the number
 
    return output;
}

// Calculates the summation of elements (n...m] of the arithmetic sequence
// with increment 'incr'.
function calcArithSum(incr,n,m)
{
    // Default to just element n+1, if m isn't given.
    if (m === undefined) { m = n + 1; }
    return (m-n)*((n*incr)+((m-1)*incr))/2;
}


// Search for the largest integer X that generates func(X) < limitY.
// func should be a continuous increasing numeric function.
//xxx This would probably be more elegant written recursively.
function logSearchFn(func, limitY)
{
    var minX = 0;
    var maxX = 0;
    var curX = 0;
    var curY;

    // First, find an upper bound.
    while ((curY = func(maxX)) <= limitY)
    {
        minX = maxX;  // Previous was too low
        maxX = maxX ? maxX * 2 : (maxX + 1);
    }
    // Invariant:  minX <= desired X < maxX

    // Now binary search the range.
    while (maxX - minX > 1)
    {
        curX = Math.floor((maxX + minX)/2); // Find midpoint
        curY = func(curX);

        if (curY <= limitY)
        {
            minX = curX; // Under limit; becomes new lower bound.
        }
        else
        {
            maxX = curX; // Over limit; becomes new upper bound.
        }
    }

    return minX;
}

// Recursively merge the properties of one object into another.
// Similar (though not identical) to jQuery.extend()
function mergeObj(o1, o2) 
{
	var i;

	if (o2 === undefined) { return o1; }

	// If either one is a non-object, just clobber o1.
	if ((typeof(o2) != 'object') || (o1 === null) ||
		(typeof(o1) != 'object') || (o2 === null))
	{
		o1 = o2;
		return o1;
	}

	// Both are non-null objects.  Copy o2's properties to o1.
	for (i in o2) { if (o2.hasOwnProperty(i)) 
	{
		o1[i] = mergeObj(o1[i], o2[i]);
	}}

	return o1;
}


// Wrapper to set an HTML element's visibility.
// Pass true as the 2nd param to be visible, false to be hidden.
// Compensates for IE's lack of support for the 'initial' property value.
// May not support all HTML elements.
function setElemDisplay(htmlElem,visible)
{
	var displayVal = (!visible) ? 'none' : 'initial';
    if (visible)
    {
        // Note that HTML comes in upper case, XML in lower.
        var tagName = htmlElem.tagName.toUpperCase();
        switch(tagName)
        {
            case 'SPAN': displayVal = 'inline'; break;
            case 'DIV': displayVal = 'block'; break;
            case 'P': displayVal = 'block'; break;
            case 'TABLE': displayVal = 'table'; break;
            case 'CAPTION': displayVal = 'table-caption'; break;
            case 'THEAD': displayVal = 'table-header-group'; break;
            case 'TBODY': displayVal = 'table-row-group'; break;
            case 'TFOOT': displayVal = 'table-footer-group'; break;
            case 'TR': displayVal = 'table-row'; break;
            case 'COL': displayVal = 'table-column'; break;
            case 'TD': displayVal = 'table-cell'; break;
            case 'LI': displayVal = 'list-item'; break;
            default: console.log("Unsupported tag <"+tagName+"> passed to setElemDisplay()"); break;
        }
    }
    htmlElem.style.display = displayVal;
}


// Workaround for IE's lack of support for the dataset property.
function dataset(elem,attr,value)
{
	if (value === undefined) { return elem.getAttribute('data-'+attr); }

	return elem.setAttribute('data-'+attr,value);
}
