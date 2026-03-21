const routes = ["/", "/projects", "/about", "/contact"];

export function getNextRoute(pathname: string) {
  const index = routes.indexOf(pathname);
  return index < routes.length - 1 ? routes[index + 1] : null;
}

export function getPrevRoute(pathname: string) {
  const index = routes.indexOf(pathname);
  return index > 0 ? routes[index - 1] : null;
}
