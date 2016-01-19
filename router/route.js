// Router.route('/', function () {
//   layoutTemplate : "layoutTemplate"
//   template: "home",
// });

// Router.route('/', function () {
//   layoutTemplate : "layoutTemplate"
//   template :"hello"
//   // this.render('hello');
// });
//
// Router.configure({
//     layoutTemplate: 'layoutTemplate'
// });
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});



Router.route('home', {
  path: '/',
  layoutTemplate: 'complexLayout',
  yieldTemplates: {
    'myFooter': {to: 'footer'}
  }
});
