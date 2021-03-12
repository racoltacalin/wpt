// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=resources/utils.js

'use strict';

compute_pressure_test(async t => {
  const obs = await navigator.deviceCompute.query();
  await new Promise(resolve => {
    obs.addEventListener('update', event => {
      assert_true((typeof event.cpuUtilization == 'number'));
      assert_true((typeof event.cpuSpeedLimit == 'number'));
      assert_greater_than_equal(
          event.cpuUtilization, 0,
          'CPU Utilization is greater or equal to zero');
      assert_greater_than_equal(
          event.cpuSpeedLimit, 0,
          'CPU Utilization is greater or equal to zero');
      resolve();
    });
  });
}, 'query(): returns an EventTarget that fires an "update" event with CPU data');
