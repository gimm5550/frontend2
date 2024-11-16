const tf = require('@tensorflow/tfjs-node');

async function testTensorFlow() {
    const model = await tf.loadLayersModel('https://tfhub.dev/google/tfjs-model/mobilenet_v2/feature_vector/4/default/1', {fromTFHub: true});
    console.log("모델 로드 성공");
}

testTensorFlow().catch(error => console.error("TensorFlow 테스트 중 오류:", error));
