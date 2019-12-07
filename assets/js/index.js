// Fetching data and sets controller ready status on success
class VODModel {
  constructor() {
    this.movieList = [];
    this.movieFetch();
  }

  movieFetch() {
    let request = new XMLHttpRequest();
    request.open('Get', 'http://testapps.tvappagency.com/sobrinho/stv_test/movies.php', true)
    request.setRequestHeader('ovs-token',"VGhpcyBpcyBhIFRWQXBwIEFnZW5jeSB2YWxpZCB0b2tlbi4=");
    request.setRequestHeader('bpm-environment',"test-api");

    request.onload = function() {
      let data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        VODModel.movieList = data;
        VODController.ready = true;
        VODController.movieList = VODModel.movieList.data;
        return 'OK'
      } else {
        console.log('Server Error!');
        return 'Server Error';
    }
    }
    request.send();
  }
}

//Most of the app functionality is inside the View, the initial language is definition is hardcoded
// to english, ultimately this would be fetched from the DB along with other user profile settings
class VODView {
  constructor(language) {
    this.language = language;
    this.appView(this.language);
  }

  // few utility methods
  createElement(elemTag, className) {
    const element = document.createElement(elemTag);
    if (className) element.classList.add(className)
    return element;
  }

  deleteElement(target) {
    const element = $(target);
    element.remove();
    return element
  }

  getElement(target) {
    const element = $(target);
    return element;
  }

  loadJsFile(fileTarget){
    var fileref=document.createElement('script')
    fileref.setAttribute('type','text/javascript')
    fileref.setAttribute('src', fileTarget)
  }

  isMainEmpty(){
    return ($('#main').html()=="");
  }
// method to set up all needed listeners for app functionality
  appReady(){
    this.getElement('#nav_sidebar').toggleClass('hidden');

    this.getElement('#welcome').on( "click", () =>{
      this.getElement('#nav_sidebar').toggleClass('hidden');
      this.getElement('#hamburger').toggleClass('hidden');
      this.welcomePage();
    });

    this.getElement('#movies').on( "click", () =>{
      this.getElement('#nav_sidebar').toggleClass('hidden');
      this.getElement('#hamburger').toggleClass('hidden');
      this.moviesPage();
    });

    this.getElement('#settings').on( "click", () =>{
      this.getElement('#nav_sidebar').toggleClass('hidden');
      this.getElement('#hamburger').toggleClass('hidden');
      this.settingsPage();
    });

    this.getElement('#hamburger').click( () => {
      this.getElement('#nav_sidebar').toggleClass('hidden');
      this.getElement('#hamburger').toggleClass('hidden');
      const overlay = this.createElement('div','overlay');
      $('#app').append(overlay);
      this.getElement('.overlay').click( () => {
        this.deleteElement('.overlay');
        this.getElement('#nav_sidebar').toggleClass('hidden');
        this.getElement('#hamburger').toggleClass('hidden');
      });
    });
    // keyboard navigation
    let moviePerRow = 5; // ideally this would be dynamically detected for resizing porpoises 
    let nav_items = $('.nav_item');
    let main_items = [];
    let counter = 0;
    let inMain = false;
    let selected = nav_items.get(counter);
    // keyboard event listening.
    $('body').on('keydown', function (key) {
      if (typeof selected !== 'undefined') selected.classList.remove('hovering');
      let navHidden = $('#nav_sidebar').hasClass('hidden');
      key.preventDefault();
      switch (key.which) {
          case 37:
              // left
              if ( navHidden && ! inMain ) {
                $('#nav_sidebar').toggleClass('hidden');
                $('#hamburger').toggleClass('hidden');
                const overlay = myView.createElement('div','overlay');
                $('#app').append(overlay);
                $('.overlay').click( () => {
                  myView.deleteElement('.overlay');
                  $('#nav_sidebar').toggleClass('hidden');
                  $('#hamburger').toggleClass('hidden');
                });
              } else if ( navHidden && inMain  ){
                if (counter > 0 ) counter --
                selected = main_items.get(counter);
                selected.classList.add('hovering');
              }
              break;
          case 38:
              // up
              if ( ! navHidden && ! inMain) {
                if (counter > 0 ) counter --
                selected = nav_items.get(counter);
                selected.classList.add('hovering');
              } else if ( navHidden && inMain  ){
                if (counter - moviePerRow > 0  ) counter -=moviePerRow
                selected = main_items.get(counter);
                selected.classList.add('hovering');
              }
              break;
          case 39:
              // right
              if ( ! navHidden && myView.isMainEmpty()) {
                myView.deleteElement('.overlay');
                $('#nav_sidebar').toggleClass('hidden');
                $('#hamburger').toggleClass('hidden');
              } else if ( ! navHidden && ! myView.isMainEmpty()) {
                myView.deleteElement('.overlay');
                $('#nav_sidebar').toggleClass('hidden');
                $('#hamburger').toggleClass('hidden');
                inMain = true;
                counter = 0;
                selected = main_items.get(counter);
              } else if ( navHidden && inMain  ){
                if (counter < main_items.length - 1  ) counter ++;
                selected = main_items.get(counter);
                selected.classList.add('hovering');
              }
              break;
          case 40:
              // down
              if ( ! navHidden && ! inMain) {
                if (counter < nav_items.length - 1  ) counter ++;
                selected = nav_items.get(counter);
                selected.classList.add('hovering');
              } else if ( navHidden && inMain  ){
                if (counter + moviePerRow < main_items.length  ) counter += moviePerRow
                selected = main_items.get(counter);
                selected.classList.add('hovering');
              }
              break;
              case 8:
                  // back
                  if ( navHidden && inMain ) {
                    $('#nav_sidebar').toggleClass('hidden');
                    $('#hamburger').toggleClass('hidden');
                    const overlay = myView.createElement('div','overlay');
                    $('#app').append(overlay);
                    $('.overlay').click( () => {
                      myView.deleteElement('.overlay');
                      $('#nav_sidebar').toggleClass('hidden');
                      $('#hamburger').toggleClass('hidden');
                    });
                    inMain = false;
                    counter = 0;
                    selected = nav_items.get(counter);
                  } else if ( ! navHidden && ! inMain && myView.isMainEmpty()) {
                    myView.deleteElement('.overlay');
                    $('#nav_sidebar').toggleClass('hidden');
                    $('#hamburger').toggleClass('hidden');
                  }
                  else if ( ! navHidden && ! inMain && ! myView.isMainEmpty()) {
                    myView.deleteElement('.overlay');
                    $('#nav_sidebar').toggleClass('hidden');
                    $('#hamburger').toggleClass('hidden');
                    inMain = true;
                    counter = 0;
                    selected = main_items.get(counter);
                  }
                  break;
              case 13:
                // Enter/Select/OK
                selected = nav_items.get(counter);
                if ( ! navHidden && ! inMain) {
                  switch (selected.id){
                    case 'movies':
                        myView.getElement('#nav_sidebar').toggleClass('hidden');
                        myView.getElement('#hamburger').toggleClass('hidden');
                        myView.moviesPage();
                        inMain = true;
                        main_items = $('.movieItem');
                        counter = 0;
                        selected = main_items.get(counter);
                        break;
                    case 'settings':
                        myView.getElement('#nav_sidebar').toggleClass('hidden');
                        myView.getElement('#hamburger').toggleClass('hidden');
                        myView.settingsPage();
                        inMain = true;
                        main_items = $('.selectLang');
                        counter = 0;
                        selected = main_items.get(counter);
                        break;
                    case 'welcome':
                        myView.getElement('#nav_sidebar').toggleClass('hidden');
                        myView.getElement('#hamburger').toggleClass('hidden');
                        myView.welcomePage();
                        counter = 0;
                        selected = nav_items.get(counter);
                        break;
                    default:
                        return; // exit 
                  }
                } else if ( navHidden && inMain ){
                    selected = main_items.get(counter);
                  switch (selected.id){
                    case 'english':
                        myView.changeLanguage('english');
                        break;
                    case 'spanish':
                        myView.changeLanguage('spanish');
                        break;
                    default:
                      return; // exit 
                  }
                }
                break;
          default:
              return; // exit 
      }
  });
}
// if controller ready check times out
  appError(){
    console.log('Server Error');
  }
// renders welcome page
  welcomePage(){
    this.deleteElement('.overlay');
    $('#main').empty();
    this.getElement('#main').css({
      'background-image':'url("./assets/images/Group 5.png")',
    })
  };
// using the lang.js file it renders the settings page with dynamic number of languages
  settingsPage(){
    this.deleteElement('.overlay');
    $('#main').empty();
    this.getElement('#main').css({
      'background-image':'url("./assets/images/background.png")',
    })
    const langSelect = this.createElement('div','langSelect');
    main.append(langSelect);
    const langHeader = this.createElement('h2','langHeader');
    const activeLanguage = lang[myView.language];
    langHeader.textContent = activeLanguage.change_app_language;
    langSelect.append(langHeader);
    Object.keys(lang).forEach(function(key) {
        let language = key;
        let langItem = myView.createElement('btn','selectLang');
        langItem.classList.add(language);
        langItem.id = language;
        langItem.textContent = language;
        langSelect.append(langItem);
        $('.selectLang.'+language).on( "click", () =>{
          myView.changeLanguage(language);
        })
    });
    $('.selectLang.'+myView.language).addClass('selected');
  }
  // method to change language in the whole app/ ideally this would be done with a template engine but for this demo I think this implementation was enough
  changeLanguage(nlang){
    $('.selectLang.'+myView.language).toggleClass('selected');
    let newLanguage = lang[nlang];
    myView.language = nlang;
    this.getElement('#movies').text(newLanguage.movies);
    this.getElement('#settings').text(newLanguage.settings);
    this.getElement('#welcome').text(newLanguage.welcome);
    this.getElement('.langHeader').text(newLanguage.change_app_language);
    $('.selectLang.'+this.language).addClass('selected');
  }
// renders movie list page, populates it with the movielist that is on the controller
  moviesPage(){
    this.deleteElement('.overlay');
    $('#main').empty();
    this.getElement('#main').css({
      'background-image':'url("./assets/images/background.png")',
    })
    const movieList = VODController.movieList;
    const movieListWrapper = this.createElement('div','movieListWrapper');
    const main = $('#main');
    let counter  = 0;
    main.append(movieListWrapper);
    movieList.forEach(movie => {
      counter ++;
      let movieItem = this.createElement('div','movieItem');
      let thumbnailURl = movie.images.keyartUrl;
      movieItem.classList.add(counter);
      movieListWrapper.append(movieItem);
      $('.movieItem.'+counter).css({
      'background-image':'url("'+thumbnailURl+'")',
      'background-repeat':'no-repeat',
      'background-position': 'center'
      })
    });
  }

  appView(){
// on Loadup show this splashscreen while it waits for the model to get the movie list to the controller
    this.getElement('#main').css({
      'background-image':'url("./assets/images/Group 5.png")',
      'background-repeat':'no-repeat',
      'background-position': 'center', 
    });
    let ready = VODController.ready;
    if (ready) {
      this.appReady();
    } else {
      const interval = setInterval( () => {
        ready = VODController.ready;
        if (! ready) this.appError()
        else this.appReady();
        clearInterval(interval);
      },2000);
    }
  }
}

class VODController {
  constructor(model, view) {
    this.movieList = [];
    this.model = model
    this.view = view
    this.ready = false;
  }
}

const app = new VODController(myModel = new VODModel(), myView = new VODView('english'))