import {Component, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Platform} from '@angular/cdk/platform';
import {CanalPlusService} from "./canalplus.service";

declare let shaka: any;

@Component({
  selector: 'app-shaka-player',
  templateUrl: './shaka-player.component.html',
  styleUrls: ['./shaka-player.component.css'],
})
export class ShakaPlayerComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoElementRef: ElementRef | undefined;
  @ViewChild('videoContainer') videoContainerRef: ElementRef | undefined;

  videoElement: HTMLVideoElement | undefined;
  videoContainerElement: HTMLDivElement | undefined;
  player: any;
  started = false;

  constructor(private platform: Platform, private canalPlusService: CanalPlusService) {
  }

  ngAfterViewInit(): void {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      this.videoElement = this.videoElementRef?.nativeElement;
      this.videoContainerElement = this.videoContainerRef?.nativeElement;
      this.canalPlusService.getCanalPlusF1Data().subscribe(data => {
        this.initPlayer(data.source);

      });
    } else {
      console.error('Browser not supported!');
    }
  }

  private initPlayer(mpdUrl: string) {
    this.player = new shaka.Player(this.videoElement);

    const ui = new shaka.ui.Overlay(
      this.player,
      this.videoContainerElement,
      this.videoElement
    );

    const config = {
      'enableTooltips': true
    }
    ui.configure(config);

    this.player.configure({
      drm: {
        clearKeys: {
          '2b3eca9093e84eb3941aec39612dc814': "97e2d3e0037b0394b3d52ad2393038d1",
          '93c2893555a240598a4a0ae40eb407d5': "ac7000a06c8c7ec0b33881d7051adc56",
          '482032e4d54c48698814d1995a3f452c': "692ff1301d75d6c6f756fc31197fff9a",
          'f370399659f54954a80a0e53c7a87b40': "c94fd8c303dbc9f6415ac2744ed92113"
        },
        servers: {},
        advanced: {},
        retryParameters: {maxAttempts: 2, baseDelay: 1000, backoffFactor: 2, fuzzFactor: 0.5, timeout: 0}
      },
    });

    let videoUrl = "https://dsh-m006-live-aka-canalplus.akamaized.net/__token__exp%3D1709329913~acl%3D%2Flive%2Fdisk%2Fcanalplusf1-hd%2F*~id%3D01HQX4J8E4TVMSK83PTX1AFK9N~hmac%3Db021422b0c992c7e59c8ebed6cc6721a72846b562c401abd2464783e11f1502f/live/disk/canalplusf1-hd/dash-fhddvr/canalplusf1-hd.mpd";
    if (this.platform.SAFARI) {
      videoUrl = "http://demo.unified-streaming.com/video/tears-of-steel/tears-of-steel.ism/.m3u8";
    }
    this.player
      .load(mpdUrl)
      .then(() => {
        console.log("started")
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  startPlayer() {
    this.started = true;
  }
}
