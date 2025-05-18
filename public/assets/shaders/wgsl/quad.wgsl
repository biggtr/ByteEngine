struct VertexInput{
    @location(0) position: vec2f,
    @location(1) texCoords: vec2f,
}
struct VertexOutput{
    @builtin(position) position: vec4f,
    @location(0) texCoords: vec2f,
}
struct Uniforms {
    color: vec4f,
    positionOffset: vec2f,
};
@group(0) @binding(2) var<uniform> uniforms: Uniforms;
@vertex
fn vertexMain(vsInput: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4f(vsInput.position + uniforms.positionOffset, 0.0, 1.0);
    output.texCoords = vsInput.texCoords;
    return output;
}

@group(0) @binding(0) var ourSampler: sampler;
@group(0) @binding(1) var ourTexture: texture_2d<f32>;

@fragment
fn fragmentMain(fsInput: VertexOutput) -> @location(0) vec4f {
    // return textureSample(ourTexture, ourSampler, fsInput.texCoords);
    return uniforms.color;
}
