var assert = require('assert');
var types = require('../src/auth/serializer/src/types');
var ops = require('../src/auth/serializer/src/operations');

describe("deip.auth: operation test", () => {

    it("templates", () => {
        for (let op in ops) {
            switch (op) {
                case "operation":
                    continue
            }
            template(ops[op])
        }
    })
})

function template(op) {

    assert(op.toObject({}, { use_default: true }))
    assert(op.toObject({}, { use_default: true, annotate: true }))


}