/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
/// <reference path="../../typings/ng2-pagination.d.ts" />

import {Component, View} from 'angular2/core';

import {Parties} from 'collections/parties';

import {PartiesForm} from 'client/parties-form/parties-form';

import {RouterLink} from 'angular2/router';

import {AccountsUI} from 'meteor-accounts-ui';

import {MeteorComponent} from 'angular2-meteor';

import {PaginationService, PaginatePipe, PaginationControlsCpm} from 'ng2-pagination';

import {RsvpPipe} from 'client/lib/pipes';

@Component({
    selector: 'parties-list',
    viewProviders: [PaginationService]
})
@View({
    templateUrl: '/client/parties-list/parties-list.html',
    directives: [PartiesForm, RouterLink, AccountsUI, PaginationControlsCpm],
    pipes: [PaginatePipe, RsvpPipe]
})
export class PartiesList extends MeteorComponent {
    parties: Mongo.Cursor<Party>;
    pageSize: number = 1;
    curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
    nameOrder: ReactiveVar<number> = new ReactiveVar<number>(1);
    partiesSize: number = 0;
    location: ReactiveVar<string> = new ReactiveVar<string>(null);

    constructor() {
        super();
        this.autorun(() => {
            let options = {
                limit: this.pageSize,
                skip: (this.curPage.get() - 1) * this.pageSize,
                sort: { name: this.nameOrder.get() }
            };
            this.subscribe('parties', options, this.location.get(), () => {
                this.parties = Parties.find({}, { sort: { name: this.nameOrder.get() } });
            }, true);
        });

        this.autorun(() => {
            this.partiesSize = Counts.get('numberOfParties');
        }, true);
    }

    removeParty(party) {
        Parties.remove(party._id);
    }

    search(value) {
        this.curPage.set(1);
        this.location.set(value);
    }

    onPageChanged(page: number) {
        this.curPage.set(page);
    }

    changeSortOrder(nameOrder) {
        this.nameOrder.set(parseInt(nameOrder));
    }

}
