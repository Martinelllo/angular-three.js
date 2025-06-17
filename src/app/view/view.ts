import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Font, FontLoader, TextGeometry, TextGeometryParameters } from 'three-stdlib';



class Animation {
  constructor(
    public movement: THREE.Vector3,
    public rotation: THREE.Euler
  ) {}
}

class StartPosition {
  constructor(
    public position: THREE.Vector3,
    public rotation: THREE.Euler,
  ) {}
}

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

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202020);
    this.scene.userData['startPosition'] = new StartPosition(this.scene.position, this.scene.rotation);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(4, 0, 6);
    this.camera.userData['startPosition'] = new StartPosition(this.camera.position, this.camera.rotation);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    // Licht
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 1);
    this.scene.add(directionalLight);

    const material = new THREE.MeshStandardMaterial({ color: 0x3399ff });

    // // Würfel mit Material
    // const geometry = new THREE.BoxGeometry();
    // const cube = new THREE.Mesh(geometry, material);
    // cube.userData['animation'] = new Animation(new THREE.Vector3(), new THREE.Euler(0, 0.005, 0));
    // cube.userData['gForce'] = new THREE.Vector3(0, -0.0001, 0);
    // this.scene.add(cube);

    // Text mit Material und Tiefe
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (font: Font) => {
      const params: TextGeometryParameters = {
        font,
        size: 1,
        height: 0.2,

      }
      const textGeometrie = new TextGeometry('Hallo', params);
      const textMash = new THREE.Mesh(textGeometrie, material);
      textGeometrie.center();
      textMash.userData['animation'] = new Animation(new THREE.Vector3(), new THREE.Euler(0, 0.005, 0));
      textMash.userData['gForce'] = new THREE.Vector3(0, -0.0001, 0);
      textMash.position.y = 1
      this.scene.add(textMash);
    });

    // set startposition here
    this.camera.position.set(4, 0, 6);


    this.loop();

    // listen for window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  loop() {
    requestAnimationFrame(() => this.loop());

    // constant movement
    this.scene.children
    .forEach(c => {
      const animation = c.userData['animation'];
      if(animation instanceof Animation) {
        c.rotation.x += animation.rotation.x
        c.rotation.y += animation.rotation.y
        c.rotation.z += animation.rotation.z

        c.position.x += animation.movement.x
        c.position.y += animation.movement.y
        c.position.z += animation.movement.z
      }
    })

    this.scene.children
    .forEach(c => {
      const gForce = c.userData['gForce'];
      if(gForce instanceof THREE.Vector3) {
        if(!(c.userData['animation'] instanceof Animation)) {
          c.userData['animation'] = new Animation(new THREE.Vector3(), new THREE.Euler());
        }
        c.userData['animation'].movement.x += gForce.x
        c.userData['animation'].movement.y += gForce.y
        c.userData['animation'].movement.z += gForce.z

        if(c.position.y < -2) {
          c.userData['animation'].movement.y = -c.userData['animation'].movement.y
          // c.userData['animation'].movement.y *= 0.9;
          // c.userData['animation'].rotation.y *= 0.6;
        }
      }

    })

    this.renderer.render(this.scene, this.camera);
  }


}
