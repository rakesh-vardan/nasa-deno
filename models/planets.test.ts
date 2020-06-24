import {
  assertEquals,
  assertNotEquals,
} from "../test_deps.ts";

import { filterHabitablePlanets } from "./planets.ts";

Deno.test({
  name: "sample test1",
  ignore: true,
  fn() {
    assertEquals("deno", "node");
    assertNotEquals({
      runtime: "deno",
    }, {
      runtime: "node",
    });
  },
});

Deno.test("Sample test2", () => {
  assertEquals("deno", "deno");
  assertNotEquals({
    runtime: "deno",
  }, {
    runtime: "node",
  });
});

Deno.test({
  name: "sample test 3",
  ignore: Deno.build.os === "linux",
  fn() {
    assertEquals("deno", "deno");
    assertNotEquals({
      runtime: "deno",
    }, {
      runtime: "node",
    });
  },
});

Deno.test({
  name: "ops leak test 1",
  sanitizeOps: false,
  fn() {
    setTimeout(console.log, 10000);
  },
});

Deno.test({
  name: "ops leak test 2",
  async fn() {
    await setTimeout(console.log, 10000);
  },
});

Deno.test({
  name: "resource leak test 1",
  async fn() {
    await Deno.open("./models/planets.ts");
  },
});

Deno.test({
  name: "resource leak test 2",
  sanitizeResources: false,
  async fn() {
    await Deno.open("./models/planets.ts");
  },
});

//Actual tests on planet data
const HABITABLE_PLANET = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1",
};

const NOT_CONFIRMED = {
  koi_disposition: "FALSE POSITIVE",
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1.5",
  koi_srad: "1",
  koi_smass: "1",
};

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1.01",
  koi_smass: "1",
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: "CONFIRMED",
  koi_prad: "1",
  koi_srad: "1",
  koi_smass: "1.04",
};

Deno.test("Filter only habitable planets", () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_MASS,
  ]);
  assertEquals(filtered, [HABITABLE_PLANET]);
});
