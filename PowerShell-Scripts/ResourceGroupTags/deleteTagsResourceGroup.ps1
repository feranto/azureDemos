##variable declaration
$resourceGroupName = "demoResourceGroup"
$tagsHashTable = @{}

## To add tags to a resource group without existing tags
Set-AzureRmResourceGroup -Name $resourceGroupName -Tag $tagsHashTable

##To apply all tags from a resource group to its resources, and retain existing tags on resources that are not duplicates, use the following script
$g = Get-AzureRmResourceGroup -Name $resourceGroupName
Find-AzureRmResource -ResourceGroupNameEquals $g.ResourceGroupName | ForEach-Object {Set-AzureRmResource -ResourceId $_.ResourceId -Tag $g.Tags -Force }