export let body = document.querySelector('body');
export let content = document.getElementById('content');

import Menu from './menu'
import Slider from './slider';
import Contacts from './contacts';
import Test from './test';
import Search from './search';
import Statistics from './statistics';
import Tour from './tour';

let slider = new Slider();
let contacts = new Contacts();
export let test = new Test();
let search = new Search();
let stats = new Statistics();
let menu = new Menu();
let tour = new Tour();

