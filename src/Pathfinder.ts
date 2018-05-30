import Simmer from 'simmerjs';


class Pathfinder {

    private root: Element;
    private simmer: Simmer;

    constructor(root: Element) {
        this.root = root;
        this.simmer = new Simmer(root, {});
    }

    findUntilRoot = (el: HTMLElement | null): string => {
        if (el === null) {
            return ""
        }
        let c: Simmer = this.simmer(el);
        return c.toString();
    }
}

export default Pathfinder;