const routes = {
  "gita": "gita/index.html",
  "sthalpothi": "sthalpothi/index.html",
  "sumanmala": "sumanmala/index.html",
  "geetapath": "geetapath/index.html",
  "sutrapath": "sutrapath/index.html",
  "ashtak": "ashtak/index.html"
};

function go(name) {
  window.location.href = routes[name];
}
