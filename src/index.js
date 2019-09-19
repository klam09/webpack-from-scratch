import $ from 'jquery';

class IndexPage {
    constructor() {
        const $root = $('<div></div>');

        if (IS_PROD) {
            $root.text('Production');
        } else {
            $root.text('Development');
        }

        $('body').append($root);
    }
}

window._indexPage = new IndexPage();
