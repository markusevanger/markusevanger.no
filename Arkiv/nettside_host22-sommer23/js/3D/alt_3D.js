
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        const camera = new THREE.PerspectiveCamera(66, window.innerWidth / window.innerHeight, 1, 1000);
        const scene = new THREE.Scene();
        let Mesh;
        let light;

        function init() {
            camera.position.set(0, 10, 20.5);
            renderer.setSize(window.innerWidth, window.innerWidth);
            document.body.appendChild(renderer.domElement);
        }

        function setLight() {
            light = new THREE.AmbientLight(0xffffff); // soft white light
            scene.add(light);
        }

        function loadGLTF() {
            let balloonLoader = new THREE.GLTFLoader();

            balloonLoader.load('assets/u_logo.glb', (glb) => {
                Mesh = glb.scene;
                Mesh.scale.set(1.5,1.5, 1.5);
                scene.add(Mesh);

                


                Mesh.position.x = 0;
                Mesh.position.y = 10.1;
                Mesh.position.z = 18.5;

               
            });
        }

        function animate() {


            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();



            requestAnimationFrame(animate);
            if (Mesh && Mesh.rotation) {
                
                Mesh.rotation.y += -0.005;
                Mesh.rotation.x += -0.0005;
                


            }
            renderer.render(scene, camera);

        }

        init();
        setLight();
        loadGLTF();
        animate();