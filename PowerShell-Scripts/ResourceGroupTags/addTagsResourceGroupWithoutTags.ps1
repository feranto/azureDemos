##variable declaration
$resourceGroupName = "examplegroup"
$tagsHashTable = @{ Dept="IT"; Environment="Test" }

## To add tags to a resource group without existing tags
Set-AzureRmResourceGroup -Name $resourceGroupName -Tag $tagsHashTable

##To apply all tags from a resource group to its resources, and not retain existing tags on the resources, use the following script
$groups = Get-AzureRmResourceGroup
foreach ($g in $groups)
{
    Find-AzureRmResource -ResourceGroupNameEquals $g.ResourceGroupName | ForEach-Object {Set-AzureRmResource -ResourceId $_.ResourceId -Tag $g.Tags -Force }
}