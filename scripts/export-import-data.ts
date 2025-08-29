import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { config } from "dotenv";
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: ".env.local" }); // Development
const devClient = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

// Production client (you'll need to set this manually)
const PROD_CONVEX_URL = "https://sensible-ermine-539.convex.cloud";
const prodClient = new ConvexHttpClient(PROD_CONVEX_URL);

interface ExportData {
  workspaces: any[];
  clients: any[];
  loanTypes: any[];
  loanFiles: any[];
  tasks: any[];
  documents: any[];
}

async function exportDevelopmentData(): Promise<ExportData> {
  console.log("📤 Exporting development data...");
  
  try {
    // Export workspaces
    const workspaces = await devClient.query(api.workspaces.list);
    console.log("✅ Exported workspaces:", workspaces.length);
    
    // Export clients
    const clients = await devClient.query(api.clients.list);
    console.log("✅ Exported clients:", clients.length);
    
    // Export loan types
    const loanTypes = await devClient.query(api.loanTypes.list);
    console.log("✅ Exported loan types:", loanTypes.length);
    
    // Export loan files
    const loanFiles = await devClient.query(api.loanFiles.list);
    console.log("✅ Exported loan files:", loanFiles.length);
    
    // Export tasks
    const tasks = await devClient.query(api.tasks.list);
    console.log("✅ Exported tasks:", tasks.length);
    
    // Export documents
    const documents = await devClient.query(api.documents.list);
    console.log("✅ Exported documents:", documents.length);
    
    const exportData: ExportData = {
      workspaces,
      clients,
      loanTypes,
      loanFiles,
      tasks,
      documents
    };
    
    // Save to file
    const exportPath = path.join(__dirname, '../data-export.json');
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    console.log("💾 Data exported to:", exportPath);
    
    return exportData;
    
  } catch (error) {
    console.error("❌ Error exporting development data:", error);
    throw error;
  }
}

async function importToProduction(exportData: ExportData) {
  console.log("📥 Importing data to production...");
  
  try {
    // Import workspaces
    for (const workspace of exportData.workspaces) {
      const { _id, _creationTime, ...workspaceData } = workspace;
      const newWorkspaceId = await prodClient.mutation(api.workspaces.create, workspaceData);
      console.log("✅ Imported workspace:", newWorkspaceId);
      
      // Update references for other entities
      workspace.newId = newWorkspaceId;
    }
    
    // Import clients
    for (const client of exportData.clients) {
      const { _id, _creationTime, workspaceId, ...clientData } = client;
      const newClientId = await prodClient.mutation(api.clients.create, {
        ...clientData,
        workspaceId: workspaceId.newId || workspaceId
      });
      console.log("✅ Imported client:", newClientId);
      client.newId = newClientId;
    }
    
    // Import loan types
    for (const loanType of exportData.loanTypes) {
      const { _id, _creationTime, workspaceId, ...loanTypeData } = loanType;
      const newLoanTypeId = await prodClient.mutation(api.loanTypes.create, {
        ...loanTypeData,
        workspaceId: workspaceId.newId || workspaceId
      });
      console.log("✅ Imported loan type:", newLoanTypeId);
      loanType.newId = newLoanTypeId;
    }
    
    // Import loan files
    for (const loanFile of exportData.loanFiles) {
      const { _id, _creationTime, workspaceId, clientId, loanTypeId, ...loanFileData } = loanFile;
      const newLoanFileId = await prodClient.mutation(api.loanFiles.create, {
        ...loanFileData,
        workspaceId: workspaceId.newId || workspaceId,
        clientId: clientId.newId || clientId,
        loanTypeId: loanTypeId.newId || loanTypeId
      });
      console.log("✅ Imported loan file:", newLoanFileId);
      loanFile.newId = newLoanFileId;
    }
    
    // Import tasks
    for (const task of exportData.tasks) {
      const { _id, _creationTime, workspaceId, clientId, loanFileId, ...taskData } = task;
      const newTaskId = await prodClient.mutation(api.tasks.create, {
        ...taskData,
        workspaceId: workspaceId.newId || workspaceId,
        clientId: clientId.newId || clientId,
        loanFileId: loanFileId.newId || loanFileId
      });
      console.log("✅ Imported task:", newTaskId);
    }
    
    console.log("🎉 Data import completed successfully!");
    
  } catch (error) {
    console.error("❌ Error importing to production:", error);
    throw error;
  }
}

async function main() {
  console.log("🔄 Data Export/Import Tool");
  console.log("==========================");
  
  try {
    // Export from development
    const exportData = await exportDevelopmentData();
    
    // Ask user if they want to import to production
    console.log("\n❓ Do you want to import this data to production?");
    console.log("⚠️  This will overwrite existing production data!");
    console.log("🔗 Production URL:", PROD_CONVEX_URL);
    
    // For now, we'll just export. Uncomment the next line to enable import
    // await importToProduction(exportData);
    
    console.log("\n✅ Export completed. Review data-export.json before importing.");
    
  } catch (error) {
    console.error("❌ Operation failed:", error);
  }
}

main().catch(console.error);
