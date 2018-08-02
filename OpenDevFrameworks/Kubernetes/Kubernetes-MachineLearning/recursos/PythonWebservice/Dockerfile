FROM ubuntu:16.04
RUN apt-get -y update \
    && apt-get install -y apt-transport-https wget \
    && echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ xenial main" | tee /etc/apt/sources.list.d/azure-cli.list \
    && wget https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb -O /tmp/prod.deb \
    && dpkg -i /tmp/prod.deb \
    && rm -f /tmp/prod.deb \
    && apt-key adv --keyserver packages.microsoft.com --recv-keys 52E16F86FEE04B979B07E28DB02C46DF417A0893 \
    && apt-get -y update \
    && apt-get install -y microsoft-r-open-foreachiterators-3.4.3 \
    && apt-get install -y microsoft-r-open-mkl-3.4.3 \
    && apt-get install -y microsoft-r-open-mro-3.4.3 \
    && apt-get install -y microsoft-mlserver-packages-r-9.3.0 \
    && apt-get install -y microsoft-mlserver-python-9.3.0 \
    && apt-get install -y microsoft-mlserver-packages-py-9.3.0 \
    && apt-get install -y microsoft-mlserver-mml-r-9.3.0 \
    && apt-get install -y microsoft-mlserver-mml-py-9.3.0 \
    && apt-get install -y microsoft-mlserver-mlm-r-9.3.0 \
    && apt-get install -y microsoft-mlserver-mlm-py-9.3.0 \
    && apt-get install -y azure-cli=2.0.26-1~xenial \
    && apt-get install -y dotnet-runtime-2.0.0 \
    && apt-get install -y microsoft-mlserver-adminutil-9.3.0 \
    && apt-get install -y microsoft-mlserver-config-rserve-9.3.0 \
    && apt-get install -y microsoft-mlserver-computenode-9.3.0 \
    && apt-get install -y microsoft-mlserver-webnode-9.3.0 \
    && apt-get clean \
    && /opt/microsoft/mlserver/9.3.0/bin/R/activate.sh

RUN echo $'from microsoftml.datasets.datasets import DataSetMtCars \n\
import pandas as pd \n\
from revoscalepy import rx_lin_mod, rx_predict \n\
cars_model = rx_lin_mod(formula="am ~ hp + wt", data=DataSetMtCars().as_df()) \n\
mydata = pd.DataFrame({"hp":[120],"wt":[2.8]}) \n\
def manualTransmission(hp, wt): \n\
\timport pandas as pd \n\
\tfrom revoscalepy import rx_predict \n\
\tnewData = pd.DataFrame({"hp":[hp], "wt":[wt]}) \n\
\treturn rx_predict(cars_model, newData, type="response") \n\
\n\
from azureml.deploy import DeployClient \n\
from azureml.deploy.server import MLServer \n\
from azureml.common.configuration import Configuration \n\
\n\
HOST = "http://localhost:12800" \n\
context = ("admin", "Microsoft@2018") \n\
client = DeployClient(HOST, use=MLServer, auth=context) \n\
service_name = "ManualTransmissionService" \n\
service_version = "1.0.0" \n\
service = client.service(service_name).version(service_version).code_fn(manualTransmission).inputs(hp=float, wt=float).outputs(answer=pd.DataFrame).models(cars_model=cars_model).description("Manual Transmission Service").deploy() \n\
res = service.manualTransmission(120, 2.8) \n\
print(res.output("answer"))' > /tmp/ManualTransmission.py

RUN echo $'#!/bin/bash \n\
set -e \n\
az ml admin bootstrap --admin-password "Microsoft@2018" --confirm-password "Microsoft@2018" \n\
mlserver-python /tmp/ManualTransmission.py \n\
exec "$@"' > bootstrap.sh
RUN chmod +x bootstrap.sh
EXPOSE 12800
ENTRYPOINT ["/bootstrap.sh"]
CMD ["bash"]