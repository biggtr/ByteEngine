struct VertexInput{
    @location(0) position: vec2f,
    @location(1) texCoords: vec2f,
}
struct VertexOutput{
    @builtin(position) position: vec4f,
    @location(0) texCoords: vec2f,
}
struct Transforms{
    u_ViewProjection: mat4x4<f32>,
    u_Model: mat4x4<f32>,
};
@group(0) @binding(0) var<uniform> transforms: Transforms;
@vertex
fn vertexMain(vsInput: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = transforms.u_ViewProjection * transforms.u_Model * vec4f(vsInput.position.xy, 1.0, 1.0);
    output.texCoords = vsInput.texCoords;
    return output;
}


@fragment
fn fragmentMain(fsInput: VertexOutput) -> @location(0) vec4f {
    return vec4f(1.0, 1.0, 0.0, 1.0);
}
