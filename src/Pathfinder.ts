import * as CssSelectorGenerator from 'css-selector-generator/build/css-selector-generator.js'

class Pathfinder {

    private root : Element;
    constructor(root: Element) {
        this.root = root;
    }

    findUntilRoot = (el: HTMLElement | null): string => {
        if (el === null) {
            return ""
        }
        let c = new CssSelectorGenerator;
        return c.getSelector(el)
    }
}

export default Pathfinder;