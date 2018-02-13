##variable declaration
<#
Tag name	                Tag value
---------                   ----------
ApplicationOwner	        The name of the person who manages this application
CostCenter                  The cost center of the group that is paying for the Azure consumption
BusinessUnit                the business unit associated with the subscription
EnvironmentType             Production (Even though the subscription includes Production in the name, including this tag enables easy identification when looking at resources in the portal or on the bill)

#>

$resourceGroupName = "demoResourceGroup"
$tagsHashTable = @{ ApplicationOwner="John Doe"; CostCenter="HR" ; BusinessUnit="IT" ; EnvironmentType="dev" }

## To add tags to a resource group without existing tags
Set-AzureRmResourceGroup -Name $resourceGroupName -Tag $tagsHashTable

##To apply all tags from a resource group to its resources, and retain existing tags on resources that are not duplicates, use the following script
$group = Get-AzureRmResourceGroup $resourceGroupName
if ($group.Tags -ne $null) {
    $resources = $group | Find-AzureRmResource
    foreach ($r in $resources)
    {
        $resourcetags = (Get-AzureRmResource -ResourceId $r.ResourceId).Tags
        foreach ($key in $group.Tags.Keys)
        {
            if (($resourcetags) -AND ($resourcetags.ContainsKey($key))) { $resourcetags.Remove($key) }
        }
        $resourcetags += $group.Tags
        Set-AzureRmResource -Tag $resourcetags -ResourceId $r.ResourceId -Force
    }
}