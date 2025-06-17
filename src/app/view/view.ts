import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ControlService } from '../services/control-service';
import { Font, FontLoader, TextGeometry, TextGeometryParameters } from 'three-stdlib';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.html',
  styleUrl: './view.scss'
})
export class View implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  animatedObjects: THREE.Mesh[] = [];

  constructor(
    private controlService: ControlService,
  ) { }

  createSzene() {
    // Licht
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 1);
    this.scene.add(directionalLight);

    // // Würfel mit Material
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshStandardMaterial({ color: 0x3399ff });
    // const cube = new THREE.Mesh(geometry, material);
    // this.scene.add(cube);
    // this.animatedObjects.push(cube)

    // Text mit Material und Tiefe
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (font: Font) => {

      const params: TextGeometryParameters = {
        font,
        size: 1,
        height: 0.2,

      }
      const geometry2 = new TextGeometry('Hallo Welt', params);
      const material2 = new THREE.MeshStandardMaterial({ color: 0x3399ff });
      const textOverlay = new THREE.Mesh(geometry2, material2);
      geometry2.center();
      this.scene.add(textOverlay);
      this.animatedObjects.push(textOverlay)

    });
  }

  setStartPosition() {
    this.camera.position.set(4, 0, 6);
    this.controls.target.set(0, 0, 0);
    this.animatedObjects.forEach(o => o.rotation.y = 0)
    this.controls.update();
  }

  // Animationsloop
  animate() {
    requestAnimationFrame(() => this.animate());
    this.animatedObjects.forEach(o => o.rotation.y += 0.005)
    this.renderer.render(this.scene, this.camera);
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.createSzene()

    this.setStartPosition()

    this.animate();

    // listen for window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.controlService.on('reset', () => {
      this.setStartPosition()
    });
  }
}
