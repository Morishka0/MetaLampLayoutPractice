class Pagination {
    constructor(root, options) {
        this.root = root
        this.options = options
        this.current = this.options.curr
        this.items = []

        this.init()
    }

    init() {
        this.root.classList.add('pagination')
        this.render()
    }

    destroy() {
        this.root.classList.remove('pagination')
        this.removeItems()
    }

    removeItems() {
        this.items.forEach(item => item.remove())
        this.items = []
    }

    render() {
        this.removeItems()

        const isCollapsed = this.options.slots < 5
        const slots = Math.min(this.options.slots, this.options.total)
        const ellipsisPos = []
        let i, showFirst, showLast

        let start = this.current - Math.round(this.options.slots / 2) + 1

        const overflow = start + slots - 1 - this.options.total
        if (overflow > 0) start -= overflow
        if (start <= 0) start -= start - 1

        const end = start + slots - 1

        const hasEllipsisLeft = start > 1
        const hasEllipsisRight = end < this.options.total
        if (hasEllipsisLeft) ellipsisPos.push(isCollapsed ? start : start + 1)
        if (hasEllipsisRight) ellipsisPos.push(isCollapsed ? end : end - 1)

        for (i = start; i <= end; i++) {
            showFirst = !isCollapsed && i == start && hasEllipsisLeft
            showLast = !isCollapsed && i == end && hasEllipsisRight

            if (showFirst) {
                this.renderElement(1)
            } else if (ellipsisPos.includes(i)) {
                this.renderElement('...')
            } else if (showLast) {
                this.renderElement(this.options.total)
                if (hasEllipsisRight) {
                    this.renderElement()
                }
            } else {
                this.renderElement(i)
            }
        }
    }

    renderElement(value) {
        const isPage = typeof value === 'number'
        const isNext = !value
        const el = document.createElement(isPage ? 'button' : 'span')
        el.classList.add('paginationItem')
        el.textContent = value

        if (isPage) {
            el.classList.add('paginationItem_button')
            el.addEventListener('click', () => {
                this.current = value
                this.render()
                $('.paginationItem_next').append(
                    `<img src="../../assets/img/PaginationArrow.svg">`
                )
            })

            if (value == this.current) {
                el.classList.add('active')
            }
        }
        if (isNext) {
            el.classList.add('paginationItem_next')

            el.addEventListener('click', () => {
                this.current = this.current + 1
                this.render()
                $('.paginationItem_next').append(
                    `<img src="../../assets/img/PaginationArrow.svg">`
                )
            })
        }

        return this.items.push(this.root.appendChild(el))
    }
}

if (document.querySelector('#pagination')) {
    ;(() => {
        new Pagination(document.querySelector('#pagination'), {
            curr: 1,
            slots: 7,
            total: 15,
        })
    })()

    $('.paginationItem_next').append(
        `<img src="../../assets/img/PaginationArrow.svg">`
    )
}
