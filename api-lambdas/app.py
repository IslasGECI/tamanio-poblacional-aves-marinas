import json

from flask import Flask, Response, request

import lambdas

app = Flask(__name__)


@app.route("/api-lambdas/lambda")
def get_lambda():
    try:
        lambda_especie = lambdas.get_lambdas(
            json.loads(request.args["temporadas"]), json.loads(request.args["maximo_nidos"])
        )
        resp = Response(json.dumps({"lambda": lambda_especie.tolist()[0]}))
    except:
        resp = Response(json.dumps({"lambda": "nan"}))
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
