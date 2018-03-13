import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, ElementRef } from "@angular/core";
import { ILinkListItemModel, LinkIconType } from "./../Components/two-column-links-list/two-column-links.model"

@Component({
    selector: 'product-info',
    templateUrl: './productInfo.component.html',
    styleUrls: ['./productInfo.component.css']
})
export class ProductInfoComponent implements OnChanges {

    @Input() wcsContent: any;
    @Output() onClick: EventEmitter<any> = new EventEmitter();
    @Output() onDocumentLinkClick: EventEmitter<any> = new EventEmitter();
    links: any[];
    documents: any[];

    childTaxonomyLinksList: ILinkListItemModel[];
    documentLinksList: ILinkListItemModel[];

    constructor(private el: ElementRef) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["wcsContent"] !== undefined) {
            const content: any = changes["wcsContent"].currentValue;
            this.links = content.ListAssoc ? content.ListAssoc.filter(item => item.type === "UI_SharedLib_C") : [];
            this.documents = content.ListAssoc ? content.ListAssoc.filter(item => item.type === "DAM_Document") : [];

            this.childTaxonomyLinksList = <ILinkListItemModel[]>this.links.map(link => { return { title: (link.title || "<No Name>").trim(), value: link } })
            this.documentLinksList = this.documents.map(doc => {
                return <ILinkListItemModel>{
                    description: doc.damDocDetails,
                    icon: true,
                    iconstyle: <LinkIconType>(doc.damExtension === "doc" ? LinkIconType.Doc : LinkIconType.Pdf),
                    title: (doc.damLinkText || "<No Name>").trim(),
                    value: doc
                }
            })
        }
    }

    onLinkClick(selectedItem) {
        window.scrollTo(0, 0);
        this.onClick.emit({ parent: this.wcsContent, item: selectedItem });
    }

    onDocumentClick(selectedItem) {
        this.onDocumentLinkClick.emit(selectedItem);
    }

    onSelection(selectedItem) {
        selectedItem.type.toLowerCase() === "ui_sharedlib_c"
            ? this.onLinkClick(selectedItem)
            : this.onDocumentClick(selectedItem);
    }
}