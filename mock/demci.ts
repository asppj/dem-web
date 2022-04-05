import { Request, Response } from 'express';

// mock tableListDataSource
const tektonProjects = (page: number, pageSize: number) => {
  return <DEM_CI.Project>[
    {
      id: 1,
      name: 'project1',
      description: 'tekton workflow demo',
      apps: [
        {
          id: 1,
          name: 'demapi',
          description: ' demapi app',
          repo: {
            id: 1,
            name: 'demapiRepo',
            git_url: 'git@github.com/api',
          },
        },
      ],
    },
    {
      id: 2,
      name: 'project2',
      description: 'tekton workflow demo',
      apps: [
        {
          id: 1,
          name: 'demci',
          description: ' demci app',
          repo: {
            id: 1,
            name: 'demciRepo',
            git_url: 'git@github.com/ci',
          },
        },
      ],
    },
  ];
};

function getTektonProjects(req: Request, res: Response, page: number, pageSize: number) {
  res.json({
    code: 0,
    msg: 'ok',
    data: tektonProjects(page, pageSize),
  });
}

export default {
  'GET /api/demci/projects': getTektonProjects,
};
