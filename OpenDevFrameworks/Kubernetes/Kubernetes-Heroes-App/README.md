#   Subiendo los contenedores de Heroes APP (Vue js, Express, MongoDb) a Azure Container Registry

En este tutorial subiremos a Azure Container Registry los contenedores de frontend, api y bbdd mongodb de la aplicación Heroes APP.

## Pre-requisitos ##

*	Instalar [git](https://git-scm.com/downloads)
*	Instalar [nodejs](https://nodejs.org/es/download/)
*	Instalar [Visual Studio Code](https://code.visualstudio.com/download)
*	Si no tienes suscripción de Azure, Activar [Visual Studio Dev Essentials](https://www.visualstudio.com/es/dev-essentials/)
*	Activar suscripción de 25 USD mensuales de Azure durante 12 meses
*   Haber ejecutado el taller de [AzureContainerRegistry-Heroes-App anteriormente](https://github.com/feranto/azureDemos/tree/master/OpenDevFrameworks/Docker/AzureContainerRegistry-Heroes-App)


## Create AKS cluster

1. Login to Azure Portal at http://portal.azure.com. Your Azure login ID will look something like `odl_user_9294@gbbossteamoutlook.onmicrosoft.com`
2. Open the Azure Cloud Shell


3. The first time Cloud Shell is started will require you to create a storage account. In our lab, you must click `Advanced` and enter an account name and share.

4. Once your cloud shell is started, clone the workshop repo into the cloud shell environment
    ```
    git clone https://github.com/Azure/blackbelt-aks-hackfest.git
    ```

5. In the cloud shell, you are automatically logged into your Azure subscription. ```az login``` is not required.
    
6. Verify your subscription is correctly selected as the default
    ```
    az account list
    ```

7. Find your RG name

    ```
    az group list 
    ```
    
    ```

    [
    {
        "id": "/subscriptions/b23accae-e655-44e6-a08d-85fb5f1bb854/resourceGroups/ODL-aks-v2-gbb-8386",
        "location": "centralus",
        "managedBy": null,
        "name": "ODL-aks-v2-gbb-8386",
        "properties": {
        "provisioningState": "Succeeded"
        },
        "tags": {
        "AttendeeId": "8391",
        "LaunchId": "486",
        "LaunchType": "ODL",
        "TemplateId": "1153"
        }
    }
    ]

    # copy the name from the results above and set to a variable 
    
    NAME=

    # We need to use a different cluster name, as sometimes the name in the group list has an underscore, and only dashes are permitted
    
    CLUSTER_NAME="${NAME//_}"
    
    ```

8. Create your AKS cluster in the resource group created above with 2 nodes, targeting Kubernetes version 1.7.7
    ```
    # This command can take 5-25 minutes to run as it is creating the AKS cluster. Please be PATIENT...
    
    # set the location to one of the provided AKS locations (eg - centralus, eastus)
    LOCATION=

    az aks create -n $CLUSTER_NAME -g $NAME -c 2 -k 1.7.7 --generate-ssh-keys -l $LOCATION
    ```

9. Verify your cluster status. The `ProvisioningState` should be `Succeeded`
    ```
    az aks list -o table

    Name                 Location    ResourceGroup         KubernetesVersion    ProvisioningState    Fqdn
    -------------------  ----------  --------------------  -------------------  -------------------  -------------------------------------------------------------------
    ODLaks-v2-gbb-16502  centralus   ODL_aks-v2-gbb-16502  1.7.7                Succeeded             odlaks-v2--odlaks-v2-gbb-16-b23acc-17863579.hcp.centralus.azmk8s.io
    ```


10. Get the Kubernetes config files for your new AKS cluster
    ```
    az aks get-credentials -n $CLUSTER_NAME -g $NAME
    ```

11. Verify you have API access to your new AKS cluster

    > Note: It can take 5 minutes for your nodes to appear and be in READY state. You can run `watch kubectl get nodes` to monitor status. 
    
    ```
    kubectl get nodes
    
    NAME                       STATUS    ROLES     AGE       VERSION
    aks-nodepool1-20004257-0   Ready     agent     4m        v1.7.7
    aks-nodepool1-20004257-1   Ready     agent     4m        v1.7.7
    ```
    
    To see more details about your cluster: 
    
    ```
    kubectl cluster-info
    
    Kubernetes master is running at https://odlaks-v2--odlaks-v2-gbb-11-b23acc-115da6a3.hcp.centralus.azmk8s.io:443
    Heapster is running at https://odlaks-v2--odlaks-v2-gbb-11-b23acc-115da6a3.hcp.centralus.azmk8s.io:443/api/v1/namespaces/kube-system/services/heapster/proxy
    KubeDNS is running at https://odlaks-v2--odlaks-v2-gbb-11-b23acc-115da6a3.hcp.centralus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    kubernetes-dashboard is running at https://odlaks-v2--odlaks-v2-gbb-11-b23acc-115da6a3.hcp.centralus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

You should now have a Kubernetes cluster running with 2 nodes. You do not see the master servers for the cluster because these are managed by Microsoft. The Control Plane services which manage the Kubernetes cluster such as scheduling, API access, configuration data store and object controllers are all provided as services to the nodes. 


# Deploy the Superhero Ratings App to AKS

## Review/Edit the YAML Config Files

1. In Azure Cloud Shell edit `heroes-db.yaml` using `vi`
    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-db.yaml
    ```
    * Review the yaml file and learn about some of the settings
    * Update the yaml file for the proper container image name
    * You will need to replace the `<login server>` with the ACR login server created in lab 2
    * Example: 

        ```
        spec:
        containers:
        - image: mycontainerregistry.azurecr.io/azureworkshop/rating-db:v1
            name:  heroes-db-cntnr
        ```

2. In Azure Cloud Shell edit `heroes-web-api.yaml` using `vi`
    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-web-api.yaml
    ```
    * Review the yaml file and learn about some of the settings. Note the environment variables that allow the services to connect
    * Update the yaml file for the proper container image names.
    * You will need to replace the `<login server>` with the ACR login server created in lab 2
        > Note: You will update the image name TWICE updating the web and api container images.

    * Example: 

        ```
        spec:
        containers:
        - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:v1
            name:  heroes-web-cntnr
        ```

## Setup AKS with access to Azure Container Registry

There are a few ways that AKS clusters can access your private Azure Container Registry. Generally the service account that kubernetes utilizes will have rights based on its Azure credentials. In our lab config, we must create a secret to allow this access. 

```
# set these values to yours
ACR_SERVER=
ACR_USER=
ACR_PWD=

kubectl create secret docker-registry acr-secret --docker-server=$ACR_SERVER --docker-username=$ACR_USER --docker-password=$ACR_PWD --docker-email=superman@heroes.com
```

> Note: You can review the `heroes-db.yaml` and `heroes-web-api.yaml` to see where the `imagePullSecrets` are configured.

## Deploy database container to AKS

* Use the kubectl CLI to deploy each app
    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-db.yaml
    ```

* Get mongodb pod name
    ```
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m

    MONGO_POD=heroes-db-deploy-2357291595-k7wjk
    ```

* Import data into MongoDB using script
    ```
    # ensure the pod name variable is set to your pod name
    # once you exec into pod, run the `import.sh` script

    kubectl exec -it $MONGO_POD bash

    root@heroes-db-deploy-2357291595-xb4xm:/# ./import.sh
    2018-01-16T21:38:44.819+0000	connected to: localhost
    2018-01-16T21:38:44.918+0000	imported 4 documents
    2018-01-16T21:38:44.927+0000	connected to: localhost
    2018-01-16T21:38:45.031+0000	imported 72 documents
    2018-01-16T21:38:45.040+0000	connected to: localhost
    2018-01-16T21:38:45.152+0000	imported 2 documents
    root@heroes-db-deploy-2357291595-xb4xm:/# exit

    # be sure to exit pod as shown above
    ```

## Deploy the web and api containers to AKS

* Use the kubectl CLI to deploy each app

    ```
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-web-api.yaml
    ```

## Validate

* Check to see if pods are running in your cluster
    ```
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-api-deploy-1140957751-2z16s   1/1       Running   0          2m
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m
    heroes-web-1645635641-pfzf9          1/1       Running   0          2m
    ```

* Check to see if services are deployed.
    ```
    kubectl get service

    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    api          LoadBalancer   10.0.20.156   52.176.104.50    3000:31416/TCP   5m
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          12m
    mongodb      ClusterIP      10.0.5.133    <none>           27017/TCP        5m
    web          LoadBalancer   10.0.54.206   52.165.235.114   8080:32404/TCP   5m
    ```

* Browse to the External IP for your web application (on port 8080) and try the app

> The public IP can take a few minutes to create with a new cluster. Sit back and relax. Maybe check Facebook. 