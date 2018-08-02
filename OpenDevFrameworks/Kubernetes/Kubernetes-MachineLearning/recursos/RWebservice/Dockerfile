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

RUN echo $'library(mrsdeploy) \n\
carsModel <- glm(formula = am ~ hp + wt, data = mtcars, family = binomial) \n\
manualTransmission <- function(hp, wt) { \n\
     newdata <- data.frame(hp = hp, wt = wt) \n\
     predict(carsModel, newdata, type = "response") \n\
} \n\
remoteLogin("http://localhost:12800", username = "admin", password = "Microsoft@2018", session = FALSE) \n\
api <- publishService("ManualTransmissionService", code = manualTransmission, model = carsModel, inputs = list(hp = "numeric", wt = "numeric"), outputs = list(answer = "numeric"), v = "1.0.0") \n\
result <- api$manualTransmission(120, 2.8) \n\
print(result$output("answer")) \n\
remoteLogout()' > /tmp/ManualTransmission.R

RUN echo $'#!/bin/bash \n\
set -e \n\
az ml admin bootstrap --admin-password "Microsoft@2018" --confirm-password "Microsoft@2018" \n\
/usr/bin/Rscript --no-save --no-restore --verbose "/tmp/ManualTransmission.R" \n\
exec "$@"' > bootstrap.sh
RUN chmod +x bootstrap.sh
EXPOSE 12800
ENTRYPOINT ["/bootstrap.sh"]
CMD ["bash"]