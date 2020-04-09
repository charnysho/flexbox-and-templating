'use strict';

let page1 = '/data/page-1.json';
let page2 = '/data/page-2.json';
let currentPage = page1;

let template = $('#images').html();

const addValuesToSection = (item) => {
  const renderedTemplate = Mustache.render(template, item);
  $('#template').append(renderedTemplate);
};

const addValuesToDropdown = (keyword) => {
  $('#dropdown-menu').append(`
      <option>${keyword}</option>
    `);
};

$('#dropdown-menu').change(function() {
  var selectedImage = $(this).children('option:selected').val();
  $('.image').hide();
  $('.' + selectedImage).show();
});

$('#sort-menu').change(function() {
  var selectedSorting = $(this).children('option:selected').val();
  let objectsArray = [];

  $.ajax(currentPage).then(data => {
    data.forEach(element => {
      objectsArray.push(element);
    });

    if(selectedSorting === 'title') {
      objectsArray.sort(function(a, b){
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
    }

    if (selectedSorting === 'number of horns') {
      objectsArray.sort(function(a, b){
        if (a.horns < b.horns) return -1;
        if (a.horns > b.horns) return 1;
      });
    }

    renderData(objectsArray);
  });
});

$('#next').click(function() {
  currentPage = page2;
  renderFile(currentPage);
  addDropdownValues(currentPage);
  $('#prev').show();
  $('#next').hide();
});

$('#prev').click(function() {
  currentPage = page1;
  renderFile(currentPage);
  addDropdownValues(currentPage);
  $('#next').show();
  $('#prev').hide();
});

function renderFile(jsonFile) {
  $.ajax(jsonFile).then(data => {
    renderData(data);
  });
}

function renderData(data) {
  $('#template').empty();
  data.forEach(addValuesToSection);
}

function addDropdownValues(jsonFile) {
  $('#dropdown-menu').empty();
  $.ajax(jsonFile).then(data => {
    let keywordArray = [];
    data.forEach(element => {
      if(!keywordArray.includes(element.keyword)) {
        keywordArray.push(element.keyword);
      }
    });
    keywordArray.forEach(addValuesToDropdown);
  });
}

renderFile(currentPage);
addDropdownValues(currentPage);
