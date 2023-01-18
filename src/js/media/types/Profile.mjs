import * as Browser from "../../core/Browser.mjs"
import { Media } from "../Media.mjs";

export default class Profile extends Media {
    _loadMedia() {

        this._el.content_item = this.domCreate("img", "tl-media-item tl-media-image tl-media-profile tl-media-shadow", this._el.content);
        this._el.content_item.src = this.data.url;

        this.onLoaded();
    }

    _updateMediaDisplay(layout) {
        if (Browser.firefox) {
            this._el.content_item.style.maxWidth = (this.options.width / 2) - 40 + "px";
        }
    }

}