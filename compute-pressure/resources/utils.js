'use strict';

function isPlatformSupported() {
  if (navigator.platform.indexOf('Android') != -1 ||
      navigator.platform.indexOf('Linux') != -1) {
    return true;
  }
  return false;
}

function compute_pressure_test(test_function, name, properties) {
  return promise_test(async (t) => {
    if (!isPlatformSupported()) {
      await promise_rejects_dom(
          t, 'NotSupportedError', navigator.deviceCompute.query());
      return;
    }
    await test_function(t, name, properties);
  });
}
