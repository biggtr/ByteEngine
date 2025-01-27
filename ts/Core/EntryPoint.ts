const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

// Fragment Shader
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
  }
`;

