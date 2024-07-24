// #region // variables
const timeline = document.querySelector('timeline');
const trace = console.log;

var item_w = Math.min(480, window.innerWidth - 32);
// #endregion

// #region // add horizontal scrolling with mouse wheel on desktop
var can_scroll = true;
timeline.addEventListener('wheel', (e) => {
	if (window.innerWidth < 640) return;
	e.preventDefault();

	if (!can_scroll) return;

	item_w = Math.min(480, window.innerWidth - 32);

	let el = document.elementFromPoint(window.innerWidth/2 + Math.sign(e.deltaY) * item_w, window.innerHeight - 160);
	if (!el || el.nodeName == 'TIMELINE') return;

	timeline.scrollTo({ left: el.offsetLeft - window.innerWidth/2 + item_w/2, behavior: 'smooth' });
	window.setTimeout(() => can_scroll = true, 250);
	can_scroll = false;
});
// #endregion

// #region // make source links clickable
timeline.querySelectorAll('source-link').forEach(e => {
	e.onclick = () => window.open(e.getAttribute('src'), '_blank');
});
// #endregion

// #region // add onclick event to items for autoscrolling
timeline.querySelectorAll('event, poll').forEach(e => e.onclick = () => {
	timeline.scrollTo({
		left: e.offsetLeft - window.innerWidth/2 + item_w/2,
		behavior: 'smooth',
	});
});
timeline.querySelectorAll('event, poll').forEach(e => e.classList.add('inactive'));
// #endregion

// #region // select item closes to center
function activate_nearest_item() {
	let nearest = document.elementFromPoint(window.innerWidth/2, window.innerHeight - 160);
	select_item(nearest);
}
window.setInterval(activate_nearest_item, 100);
// #endregion

// #region // select item function
var active = undefined;
function select_item(ev) {
	if (active === ev) return;
	if (active) active.classList.add('inactive');
	ev.classList.remove('inactive');
	active = ev;
}
// #endregion

// #region // add scrolling for long quotes
const pointerScroll = (elem) => {
	const dragStart = (ev) => elem.setPointerCapture(ev.pointerId);
	const dragEnd = (ev) => elem.releasePointerCapture(ev.pointerId);
	const drag = (ev) => elem.hasPointerCapture(ev.pointerId) && (elem.scrollLeft -= ev.movementX);

	elem.addEventListener("pointerdown", dragStart);
	elem.addEventListener("pointerup", dragEnd);
	elem.addEventListener("pointermove", drag);
};
document.querySelectorAll(".parent").forEach(pointerScroll);
// #endregion

// #region // add poll text above poll title
document.querySelectorAll('poll').forEach((e) => {
	e.innerHTML = `<h3>poll</h3>\n${e.innerHTML}`;
});
// #endregion

// #region // add selector to polls with multiple columns
document.querySelectorAll('table').forEach(tbl => {
	var len = tbl.querySelector('tr').querySelectorAll('td').length;
	if (len <= 2) return;
	var selector = document.createElement('poll-selector');
	tbl.parentNode.appendChild(selector);
	initialize_poll_selector(selector, tbl, tbl.querySelector('tr').querySelectorAll('td'));
});
function initialize_poll_selector(sel, tbl, cols) {
	let ignore_first = true;
	for (let col of cols) {
		if (ignore_first) {
			ignore_first = false;
			continue;
		}
		let pip = document.createElement('selector-pip');
		pip.onclick = (e) => {
			tbl.scrollTo({ left: col.offsetLeft - 12, behavior: 'smooth' });
			sel.querySelectorAll('selector-pip').forEach((e) => e.classList.remove('active'));
			pip.classList.add('active');
		}
		sel.appendChild(pip);
	}
	sel.querySelector('selector-pip').classList.add('active');
}
// #endregion

// #region // set background image
function set_background_image() {
	let bg_img = document.querySelector('body').getAttribute('bg-image');
	let slug = window.location.pathname.substring(1, window.location.pathname.lastIndexOf('/'));
	trace(slug, window.location.pathname);
	document.documentElement.style.setProperty('--bg-image', `url(${slug}/${bg_img})`);
}
set_background_image();
// #endregion