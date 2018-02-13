##variable declaration
$resourceGroupName = "bot-feria-adessa"
$tagsHashTable = @{ Dept="IT"; Environment="Test" }

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