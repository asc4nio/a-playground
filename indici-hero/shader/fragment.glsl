            precision mediump float;


            //uniform float uTime;
            uniform vec3 colorA;

            uniform sampler2D uTexture;


            varying vec2 vUv;


            void main()
            {
                vec4 textureColor = texture2D(uTexture, vUv);
                
                gl_FragColor = textureColor;
                //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0 );
            }