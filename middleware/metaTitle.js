export default ({store, route, redirect}) => {
    route.matched.forEach((item, index) => {
        item.meta.title = route.meta[index].title || '';
        item.meta.breadNumber = route.meta[index].breadNumber || 0;
    })
}