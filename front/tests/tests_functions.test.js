const answer = require("../public_html/js/functions");

describe("Que vamos a probar?", function(){
    it("escenario 1", function(){
      expect(answer.returnTrue()).toStrictEqual(true);
    });
});

// describe("Que vamos a probar?", function(){
//     it("escenario 1", function(){
//       expect(answer.setSeason()).
//     });
// });