import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common'; 

interface InputPath {
  filename: string;
  filepath: string;
}

interface DirectoryNode {
  name: string;
  isDirectory: true;
  items: TreeNode[];
}

interface FileNode {
  name: string;
  isDirectory: false;
  downloadUrl: string;
}

type TreeNode = DirectoryNode | FileNode;

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css'],
  imports: [
    NgFor,
    CommonModule
  ]
})
export class FileTreeComponent implements OnInit {
  filePaths: InputPath[] = [
    { filename: "Region1/title1/file1", filepath: "file1.jpg" },
    { filename: "Region1/title2/file2", filepath: "file2.jpg" },
    { filename: "Region1/title1/file3", filepath: "file3.jpg" },
    { filename: "Region1/title1/folder1/file4", filepath: "file4.jpg" },
    { filename: "Region2/title2/folder1/file5", filepath: "file5.jpg" },
    { filename: "Region3", filepath: "fileR3.jpg" }
  ];

  processedPath: Array<any> = []; 

  ngOnInit(): void {
    this.processedPath = this.buildTree(this.filePaths);
  }

  private buildTree(paths: InputPath[]): TreeNode[] {
    const root: TreeNode[] = [];

    for (const { filename, filepath } of this.filePaths) {
      const parts = filename.split('/');
      let currentLevel = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLeaf = i === parts.length - 1;

        if (isLeaf && parts.length === 1) {
          currentLevel.push({
            name: part,
            isDirectory: false,
            downloadUrl: filepath
          });
          break;
        }

        let existing = currentLevel.find(node => node.name === part);

        if (!existing) {
          if (isLeaf) {
            currentLevel.push({
              name: part,
              isDirectory: false,
              downloadUrl: filepath
            });
          } else {
            const dirNode: DirectoryNode = {
              name: part,
              isDirectory: true,
              items: []
            };
            currentLevel.push(dirNode);
            existing = dirNode;
          }
        }
        if (!isLeaf && existing && existing.isDirectory) {
          currentLevel = existing.items;
        }
      }
    }
    return root;
  }

  isFile(node: TreeNode): node is FileNode {
    return !node.isDirectory;
  }

}
