import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { LngLat } from 'maplibre-gl';

import { InterestPointsService } from '../../services/interest-points/interest-points.service';
import { poiListDialogActions } from '../../store/actions/navigation.actions';
import { ListInterestPointsDialogComponent } from './list-interest-points-dialog.component';

@Component({
  template: '',
  standalone: true,
  imports: [MatDialogModule],
})
class WrapperComponent {
  dialog = inject(MatDialog);
  constructor() {
    const instance = this.dialog.open(ListInterestPointsDialogComponent, {
      width: '100%',
      closeOnNavigation: false,
    }).componentInstance;
    instance.showDetails = cy.spy().as('showDetailsSpy');
    instance['store'].dispatch = cy.spy().as('storeDispatchSpy');
  }
}

describe(ListInterestPointsDialogComponent.name, () => {
  it('renders', () => {
    cy.mount(WrapperComponent, {
      providers: [
        {
          provide: InterestPointsService,
          useValue: {
            getPoints: () => Promise.resolve(points),
            imageList: imageList,
            getSrcFromIconName: (iconName: string) =>
              imageList.find((img) => img.name === iconName)?.src,
          },
        },
        provideMockStore({}),
      ],
    });

    cy.get('.first-button').should('have.length', 7);
    cy.get(':nth-child(3) .first-button').click();
    cy.get('@showDetailsSpy').should('have.been.calledOnceWith', detailPoint);
    cy.get(':nth-child(3) .mat-accent').click();
    cy.get('@storeDispatchSpy').should(
      'have.been.calledWith',
      poiListDialogActions.addedPointToNavigation({
        point: {
          lat: detailPoint.geometry.coordinates[1],
          lng: detailPoint.geometry.coordinates[0],
        } as LngLat,
        name: detailPoint.properties.name,
      })
    );
  });
});

const points = JSON.parse(
  '[{"type":"Feature","properties":{"name":"lietadlo","icon":"poi1","description":"<p><span class=\\"ql-size-large\\">pekny text</span></p>","id":"0b0a7901-3214-4558-9386-0d7acf6a453e"},"geometry":{"type":"Point","coordinates":[18.074908546302225,47.89568329891685]},"_id":"0b0a7901-3214-4558-9386-0d7acf6a453e","_rev":"4-875deacf9c06e5c55842e2c3f27ca1d7"},{"type":"Feature","properties":{"name":"nieco dlhe nech mozem skusat","icon":"poi12","description":"","id":"5c544a35-9227-4a95-abf2-8933118c4a2e"},"geometry":{"type":"Point","coordinates":[18.63860334443268,48.17856896434233]},"_id":"5c544a35-9227-4a95-abf2-8933118c4a2e","_rev":"1-4282279f61c9cb8ce531d72fed422243"},{"type":"Feature","properties":{"name":"much love","icon":"poi5","description":"","id":"7eed3d5b-bfc8-42ac-ac9a-13f2789eea68"},"geometry":{"type":"Point","coordinates":[18.06966427257794,47.87757173400482]},"_id":"7eed3d5b-bfc8-42ac-ac9a-13f2789eea68","_rev":"2-4852b22d90483ab8d3f4b1e93371a19d"},{"type":"Feature","properties":{"name":"warn","icon":"poi10","description":"","id":"8378617f-8510-4a18-9ef2-07be22345000"},"geometry":{"type":"Point","coordinates":[18.44705513245347,47.920473596381896]},"_id":"8378617f-8510-4a18-9ef2-07be22345000","_rev":"3-f54a9d129f1339d9d470f5306c32e7f1"},{"type":"Feature","properties":{"name":"photo","icon":"poi13","description":"","id":"837c26af-48ee-47e9-a6e8-4dbc827daa09"},"geometry":{"type":"Point","coordinates":[18.165896695435606,47.90605503180785]},"_id":"837c26af-48ee-47e9-a6e8-4dbc827daa09","_rev":"1-8544ee887193c962c47df43ca0c75ae6"},{"type":"Feature","properties":{"name":"home","icon":"poi11","description":"","id":"b2d6ecec-28dc-4ebd-be9b-d7057622af24"},"geometry":{"type":"Point","coordinates":[18.064419998852202,47.9092188756278]},"_id":"b2d6ecec-28dc-4ebd-be9b-d7057622af24","_rev":"1-7e696f2ca95844fed49de4139f9d5ad5"},{"type":"Feature","properties":{"name":"yy","icon":"poi21","description":"","id":"fb4af2fb-6be6-41a1-b8a0-efe53396f1bc"},"geometry":{"type":"Point","coordinates":[18.339309263213607,48.10467389470128]},"_id":"fb4af2fb-6be6-41a1-b8a0-efe53396f1bc","_rev":"1-f04314b4a28e266df62932c9051a9d35"}]'
);

const detailPoint = points[2];

const imageList = Array(26)
  .fill({})
  .map((_, index) => ({
    name: `poi${index + 1}`,
    src: `assets/poi/poi${index + 1}.png`,
  }));
